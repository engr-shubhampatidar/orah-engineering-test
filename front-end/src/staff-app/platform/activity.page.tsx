import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@material-ui/core"
import React, { useEffect } from "react"
import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { FontWeight, Spacing } from "shared/styles/styles"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import styled from "styled-components"

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  useEffect(() => {
    getActivities()
  }, [])

  return (
    <>
      <S.Container>
        <S.Typography variant="h5" >Activities</S.Typography>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && (data?.activity.length ? <S.TableContainer>
          <S.Table>
            <S.TableHead>
              <S.TableRow>
                <S.TableCell>S.no</S.TableCell>
                <S.TableCell>Roll</S.TableCell>
                <S.TableCell>Roll Status</S.TableCell>
                <S.TableCell>Date</S.TableCell>
              </S.TableRow>
            </S.TableHead>
            <S.TableBody>
              {data?.activity.map((activity, index) => {
                return (
                  <S.TableRow key={index} >
                    <S.TableCell>{index + 1}</S.TableCell>
                    <S.TableCell>{activity.entity.name}</S.TableCell>
                    <S.TableCell>{activity.entity.student_roll_states[0].roll_state}</S.TableCell>
                    <S.TableCell>{new Date(activity.date).toDateString()}</S.TableCell>
                  </S.TableRow>
                )
              })}
            </S.TableBody>
          </S.Table>
        </S.TableContainer> : <S.BlankMessage variant="h1" >No Activites Yet</S.BlankMessage>)}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.Container>
    </>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
    text-align: center;
  `,
  TableContainer: styled(TableContainer)`
    && {
    }
  `,
  Table: styled(Table)`
    && {
    }
  `,
  TableHead: styled(TableHead)`
    && {
    }
  `,
  TableRow: styled(TableRow)`
    && {
    }
  `,
  TableBody: styled(TableBody)`
    && {
    }
  `,
  TableCell: styled(TableCell)`
    && {
    }
  `,
  Typography: styled(Typography)`&&{
    background: #343f64;
    color: white;
    font-weight: ${FontWeight.mediumStrong};
  }`,
  BlankMessage: styled(Typography)`&&{
    color: black;
    margin-top: 50px;
    font-weight: ${FontWeight.mediumStrong};
  }`
}
