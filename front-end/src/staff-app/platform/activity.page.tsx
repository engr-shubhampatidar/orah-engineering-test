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
                    <S.Table>
                      <S.TableHead>
                        <S.TableRow >
                          <S.TableCell align="center" >Student Id</S.TableCell>
                          <S.TableCell align="center" >Roll Status</S.TableCell>
                        </S.TableRow>
                      </S.TableHead>
                      <S.TableBody>
                        {roll?.entity?.student_roll_states.map((activity, index) => {
                          return (
                            <S.TableRow key={index}>
                              <S.TableCell align="center">{activity.student_id}</S.TableCell>
                              <S.TableCell align="center" >{activity.roll_state}</S.TableCell>
                            </S.TableRow>
                          )
                        })}
                      </S.TableBody>
                    </S.Table>
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
      align: ${(props) => props.align ? "center" : "left"}
    }
  `,
  Typography: styled(Typography)`
    && {
      background: #343f64;
      color: white;
      font-weight: ${FontWeight.mediumStrong};
    }
  `,
  Date: styled(Typography)`
    && {
    color: white;
    font-weight: 500;
    background: cornflowerblue;
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
    border: 2px solid #e4cf0a1f;
    background: aliceblue;
    margin: 10px 0;
  }`,
}
