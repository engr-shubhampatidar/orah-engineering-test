import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Grid, Paper } from "@material-ui/core"
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
              {/* <S.TableContainer> */}
              <S.Grid container spacing={2}>
                {data.activity.map((roll, index) => {
                  return (
                    <S.GridItem item xs={6} key={index}>

                      <S.Date>{new Date(roll.date).toLocaleString()}</S.Date>
                      <Paper>
                        <S.TableContainer>
                          <Table stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell align="center">Student Id</TableCell>
                                <TableCell align="center">Roll Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {roll?.entity?.student_roll_states.map((activity, index) => {
                                return (
                                  <TableRow key={index}>
                                    <TableCell align="center">{activity.student_id}</TableCell>
                                    <TableCell align="center">{activity.roll_state}</TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </S.TableContainer>
                      </Paper>
                    </S.GridItem>
                  )
                })}
              </S.Grid>
              {/* </S.TableContainer> */}
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
      height: 271px;
      overflow-y: auto;
      overflow-x: hidden;

    ::-webkit-scrollbar {
        -webkit-appearance: none;
    }

    ::-webkit-scrollbar:vertical {
        width: 8px;
    }

    ::-webkit-scrollbar:horizontal {
        height: 8px;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 8px;
        border: 2px solid white;
        background-color: rgb(150 160 195 / 17%)
    }

    }`,
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
      font-weight: 300;
      background: #1b4f90;
      width: 100%;
      border-radius: 5px 5px 0 0;
      padding: 10px 0;
    }
  `,
  BlankMessage: styled(Typography)`
    && {
      color: black;
      margin-top: 50px;
      font-weight: ${FontWeight.mediumStrong};
    }
  `,
  Box: styled(Box)`
    && {
      margin: 10px 0;
    }
  `,
  GridItem: styled(Grid)`
    &&{
    }
  `,
  Grid: styled(Grid)`
    &&{
      justify-content: center;
      margin-top: 2px;
      margin-bottom: ${Spacing.u4};
    }
  `,
}
