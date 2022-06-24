import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { RolllStateType } from "shared/models/roll"
import { Attendance } from "shared/models/attendance"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [studentData, setStudentData] = useState<Person[]>([])
  const [attendance, setAttendance] = useState<Attendance>({ all: 0, present: 0, late: 0, absent: 0 })

  const [orderBy, setOrderBy] = useState('');
  const [orderIn, setOrderIn] = useState('')

  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if (loadState === "loaded" && data?.students) {
      setStudentData(() => data?.students.map((student) => ({ ...student, rollStatus: 'unmark' })))
    }
  }, [loadState, data])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  const onToolBarInput = (input: ToolbarInput) => {
    const filterData = data?.students.filter((student) =>
      student.first_name.concat(student.last_name).toLowerCase()
        .includes(input.toLowerCase().replace(/ /g, '')))
    if (filterData) {
      setStudentData(() => [...filterData])
    }
  }

  const onToolBarOrderBy = (orderBy: ToolbarOrderBy) => {
    setOrderBy(orderBy)
  }

  const onToolBarOrderIn = (orderIn: ToolbarOrderIn) => {
    setOrderIn(orderIn)
  }


  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const changeRollStatus = (value: RolllStateType, id: number) => {
    setStudentData(() => studentData.map((student) => {
      if (student.id === id) {
        return ({ ...student, ['rollStatus']: value })
      } else {
        return student
      }
    }))
  }


  useEffect(() => {
    let all = 0;
    let absent = 0;
    let late = 0;
    let present = 0;

    studentData.map((student) => {
      if (student.rollStatus) {
        if (student.rollStatus === "present") {
          present += 1;
        }
        if (student.rollStatus === "late") {
          late += 1;
        }
        if (student.rollStatus === "absent") {
          absent += 1;
        }
        all += 1;
      }
    })
    setAttendance({ ...attendance, all, present, late, absent })
  }, [studentData])

  const compare = (a: Person, b: Person, key: string) => {
    if (key === "first_name") {
      return a.first_name.localeCompare(b.first_name)
    } else {
      return a.last_name.localeCompare(b.last_name)
    }
  }

  useEffect(() => {
    if (orderBy !== "" && orderIn !== "" && data?.students) {
      if (orderIn === "ascending") {
        setStudentData([...data.students.sort((a, b) => compare(a, b, orderBy))])
      }
      if (orderIn === "descending") {
        setStudentData([...data.students.sort((a, b) => compare(b, a, orderBy))])
      }
    }
  }, [orderBy, orderIn])


  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} onInput={onToolBarInput} onSelectOrderBy={onToolBarOrderBy} onSelectOrderIn={onToolBarOrderIn} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && studentData && (
          <>
            {studentData.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} onRollChange={changeRollStatus} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} attendance={attendance} />
    </>
  )
}

type ToolbarAction = string
type ToolbarInput = string
type ToolbarOrderIn = string
type ToolbarOrderBy = string

interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void,
  onInput: (action: ToolbarInput, value?: string) => void,
  onSelectOrderIn: (action: ToolbarOrderIn, value?: string) => void,
  onSelectOrderBy: (action: ToolbarOrderBy, value?: string) => void
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onInput, onSelectOrderBy, onSelectOrderIn } = props
  return (
    <S.ToolbarContainer>
      {/* <div onClick={() => onItemClick("sort")}>First Name</div> */}
      <select defaultValue={"none"} onChange={(event) => onSelectOrderIn(event?.target.value)} >
        <option disabled value={"none"} >Select Sort</option>
        <option value={"ascending"} >Ascending</option>
        <option value={"descending"}>Descending</option>
      </select>
      {/* <div>Search</div> */}
      <fieldset id="radio-group">
        <label htmlFor="firstName">First Name</label>
        <input type="radio" name="radio-group" id="firstName" value={"first_name"} onChange={(event) => onSelectOrderBy(event?.target.value)} />
        <label htmlFor="lastName">Last Name</label>
        <input type="radio" name="radio-group" id="lastName" value={"last_name"} onChange={(event) => onSelectOrderBy(event?.target.value)} />
      </fieldset>
      {/* search box  */}
      <input type="text" name="Search Bar" id="search-bar" placeholder="Search" onChange={(event) => onInput(event.target.value)} />

      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer >
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
