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
import { RollInput, RolllStateType } from "shared/models/roll"
import { Attendance } from "shared/models/attendance"

export type ToolbarOrderBy = "first_name" | "last_name"
export type ToolbarOrderIn = "ascending" | "descending"
export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [studentData, setStudentData] = useState<Person[]>([])

  const [attendance, setAttendance] = useState<Attendance>({ all: 0, present: 0, late: 0, absent: 0 })

  const [studentRollStatus, setStudentRollStatus] = useState<RollInput>({ student_roll_states: [] });

  const [orderBy, setOrderBy] = useState<ToolbarOrderBy>();
  const [orderIn, setOrderIn] = useState<ToolbarOrderIn>()

  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  const [setRollData, loadStates] = useApi({ url: "save-roll", params: studentRollStatus })


  useEffect(() => {
    void getStudents()
  }, [getStudents])


  useEffect(() => {
    if (data?.students) {
      setStudentData(data?.students)
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

  const onToolBarOrderBy = (value?: ToolbarOrderBy) => {
    setOrderBy(value)
  }

  const onToolBarOrderIn = (value?: ToolbarOrderIn) => {
    setOrderIn(value)
  }

  const saveRoll = () => {
    setRollData()
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
    if (action === "saveActiveRoll") {
      saveRoll();
      setIsRollMode(false)
    }
  }


  const changeAttendance = () => {
    let all = 0;
    let absent = 0;
    let late = 0;
    let present = 0;

    data?.students.map((student) => {
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
  }

  const changeRollStatus = (value: RolllStateType, id: number) => {
    data?.students.map((student, index) => {
      if (student.id === id) {
        data.students[index].rollStatus = value;
      }
    })

    changeAttendance()


    if (studentRollStatus?.student_roll_states.length > 0) {
      let index = studentRollStatus.student_roll_states.findIndex(student => student.student_id === id)
      if (index >= 0) {
        const newData = { student_roll_states: [...studentRollStatus?.student_roll_states] }
        newData.student_roll_states[index].roll_state = value;
        setStudentRollStatus(newData)
      } else {
        setStudentRollStatus({ student_roll_states: [...studentRollStatus?.student_roll_states, { student_id: id, roll_state: value }] })
      }
    } else {
      setStudentRollStatus({ student_roll_states: [{ student_id: id, roll_state: value }] })
    }
  }

  const filterByRole = (value: string) => {
    if (data?.students) {
      if (value === "all") {
        setStudentData(data?.students)
      } else {
        setStudentData([...data?.students.filter((student) => student.rollStatus === value)])
      }
    }
  }

  //  Filter  
  const compare = (a: Person, b: Person, key?: ToolbarOrderBy) => {
    if (key) {
      return a[key].localeCompare(b[key])
    } else {
      return a.first_name.localeCompare(b.first_name)
    }
  }

  useEffect(() => {
    if (orderIn && data?.students) {
      if (orderIn === "ascending") {
        setStudentData(() => [...data.students.sort((a, b) => compare(a, b, orderBy))])
      }
      if (orderIn === "descending") {
        setStudentData(() => [...data.students.sort((a, b) => compare(b, a, orderBy))])
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
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} attendance={attendance} onRollTypeClick={filterByRole} />
    </>
  )
}

type ToolbarAction = string
type ToolbarInput = string

interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void,
  onInput: (action: ToolbarInput, value?: string) => void,
  onSelectOrderIn: (value: ToolbarOrderIn) => void,
  onSelectOrderBy: (value: ToolbarOrderBy) => void
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onInput, onSelectOrderBy, onSelectOrderIn } = props

  return (
    <S.ToolbarContainer>
      {/* Order In  */}
      <S.Select defaultValue={"none"} onChange={(event) => onSelectOrderIn(event.target.value as ToolbarOrderIn)}>
        <S.Option value={"none"} disabled >Order In</S.Option>
        <S.Option value={"ascending"} >Ascending</S.Option>
        <S.Option value={"descending"}>Descending</S.Option>
      </S.Select>
      {/* Order By  */}
      <S.Select defaultValue={"none"} onChange={(event) => onSelectOrderBy(event.target.value as ToolbarOrderBy)}>
        <S.Option value={"none"} disabled >Order By</S.Option>
        <S.Option value={"first_name"} >First Name</S.Option>
        <S.Option value={"last_name"}>Last Name</S.Option>
      </S.Select>
      {/* search box  */}
      <S.SearchBar type="text" name="Search Bar" id="search-bar" placeholder="Search" onChange={(event) => onInput(event.target.value)} />
      {/* Roll  */}
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
  Select: styled.select`{
    cursor: pointer;
    padding: 7px;
    border-radius: 2px;
    background: transparent;
    color: white;
    border: none;
  }`,
  Option: styled.option`{
    background: white;
    color: black;
  }`,
  SearchBar: styled.input`{
    padding: 6px;
    border-radius: 2px;
    background: transparent;
    color: white;
    border: 1px solid grey;
  }`,
}
