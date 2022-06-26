import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from "@material-ui/core"
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

  console.log(data)

  return (
    <>
      <S.Container>
        <S.Typography variant="h5">Activities</S.Typography>

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" &&
          (data?.activity.length ? (
            <>
              {data.activity.map((roll, index) => {
                return <S.Box key={index}>
                  <S.Date>Date - {new Date(roll.date).toLocaleString()}</S.Date>
                  <S.TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow >
                          <TableCell align="center" >Student Id</TableCell>
                          <TableCell align="center" >Roll Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roll?.entity?.student_roll_states.map((activity, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell align="center">{activity.student_id}</TableCell>
                              <TableCell align="center" >{activity.roll_state}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </S.TableContainer>
                </S.Box>
              })}
            </>
          ) : (
            <S.BlankMessage variant="h1">No Activites Yet</S.BlankMessage>
          ))}

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
    border-left: 2px solid #1d4ae01f;
    border-right: 2px solid #1d4ae01f;
    border-bottom: 22px solid #1d4ae01f;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    }
  `,
  Typography: styled(Typography)`
    && {
      background: #343f64;
      color: white;
      font-weight: ${FontWeight.mediumStrong};
      border-radius: 5px;
    }
  `,
  Date: styled(Typography)`
    && {
    color: white;
    font-weight: 500;
    background: #495b9b8c;
    width: 100%;
    padding: 2px;
    border-radius: 5px 5px 0 0;
    }
  `,
  BlankMessage: styled(Typography)`
    && {
      color: black;
      margin-top: 50px;
      font-weight: ${FontWeight.mediumStrong};
    }
  `,
  Box: styled(Box)`&&{
    margin: 10px 0;
  }`,
}
