import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React, { useCallback, useEffect, useState } from "react"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { useApi } from "shared/hooks/use-api"
import { Attendance } from "shared/models/attendance"
import { Person } from "shared/models/person"
import { RollInput, RolllStateType } from "shared/models/roll"
import { Spacing } from "shared/styles/styles"
import { ActiveRollAction, ActiveRollOverlay } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { Toolbar, ToolbarAction, ToolbarInput } from 'staff-app/components/tool-bar/toolbar'
import { getAttendence, SearchAlgorithms } from "staff-app/components/utils/util"
import styled from "styled-components"

export type ToolbarOrderBy = "first_name" | "last_name"
export type ToolbarOrderIn = "ascending" | "descending"

export const HomeBoardPage: React.FC = () => {
  // states
  const [isRollMode, setIsRollMode] = useState(false)

  const [orderBy, setOrderBy] = useState<ToolbarOrderBy>();
  const [orderIn, setOrderIn] = useState<ToolbarOrderIn>()

  const [studentData, setStudentData] = useState<Person[]>([])

  const [attendance, setAttendance] = useState<Attendance>({ all: 0, present: 0, late: 0, absent: 0 })
  const [studentRollStatus, setStudentRollStatus] = useState<RollInput>({ student_roll_states: [] });

  //  api calls 
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [setRollData] = useApi({ url: "save-roll", params: studentRollStatus })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if (data?.students) {
      setStudentData(data?.students)
    }
  }, [loadState, data])

  //  Filter  
  const compare = (a: Person, b: Person, key: ToolbarOrderBy = "first_name") => {
    return a[key].localeCompare(b[key])
  }

  const filterData = (orderIn: ToolbarOrderIn = "ascending", orderBy: ToolbarOrderBy = "first_name", data: Person[]) => {
    let newData = data.sort((a, b) => compare(a, b, orderBy));
    return orderIn === "descending" ? newData?.reverse() : newData
  }

  useEffect(() => {
    if (data?.students) {
      const newData = filterData(orderIn, orderBy, data?.students);
      setStudentData(() => [...newData])
    }
  }, [orderIn, orderBy])

  const onToolBarOrderBy = (value?: ToolbarOrderBy) => {
    setOrderBy(value)
  }

  const onToolBarOrderIn = (value?: ToolbarOrderIn) => {
    setOrderIn(value)
  }

  // search
  const onToolBarInput = (input: ToolbarInput) => {
    if (data?.students) {
      setStudentData(() => [...SearchAlgorithms(input, data?.students)])
    }
  }

  // Roll Mode
  const onToolbarAction = (action: ToolbarAction) => {
    if (action === "roll") {
      setIsRollMode(true)
    }
  }

  // close roll modal
  const closeAndResetRoll = () => {
    setIsRollMode(false)
    data?.students && setStudentData(data?.students)
    setAttendance({ all: 0, absent: 0, late: 0, present: 0 })
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    closeAndResetRoll()
    if (action === "saveActiveRoll") {
      setRollData()
    }
  }

  // calculating the attendance & saving
  const changeAttendance = useCallback(
    () => {
      const attendance = getAttendence(studentRollStatus)
      setAttendance(attendance)
    },
    [studentRollStatus],
  );

  useEffect(() => {
    changeAttendance()
  }, [studentRollStatus, changeAttendance])


  const updateStudentRollStatus = (value: RolllStateType, id: number) => {
    let index = studentRollStatus.student_roll_states.findIndex(student => student.student_id === id)
    if (index >= 0) {
      setStudentRollStatus((previousState) => ({
        student_roll_states: previousState.student_roll_states.map(((item, i) => i === index
          ? Object.assign(item, { roll_state: value })
          : item))
      }));
    } else {
      setStudentRollStatus({
        student_roll_states: [...studentRollStatus?.student_roll_states, { student_id: id, roll_state: value }]
      })
    }
  }

  const changeRollStatus = (value: RolllStateType, id: number) => {
    updateStudentRollStatus(value, id)
    data?.students.map((student, index) =>
      student.id === id ?
        data.students[index].rollStatus = value : data
    )
  }

  const filterByRoll = (value: string) => {
    if (data?.students) {
      setStudentData([...data?.students.filter((student) =>
        value === "all" ? student?.rollStatus : student.rollStatus === value
      )])
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} onInput={onToolBarInput} onSelectOrderBy={onToolBarOrderBy} onSelectOrderIn={onToolBarOrderIn} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && (studentData.length ? (
          <>
            {studentData.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} onRollChange={changeRollStatus} />
            ))}
          </>
        ) : <S.ErrorMessage>No Match Found</S.ErrorMessage>)}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} attendance={attendance} onRollTypeClick={filterByRoll} />
    </>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ErrorMessage: styled.p`{
    background: #1b4f90;
    text-align: center;
    padding: 10px;
    font-weight: 300;
    color: white;
    border-radius: 5px;
  }`
}
