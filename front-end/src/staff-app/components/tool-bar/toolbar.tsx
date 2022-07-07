import React from "react"
import styled from "styled-components"

import Button from "@material-ui/core/ButtonBase"
import { Box } from "@material-ui/core"
import { Colors } from "shared/styles/colors"
import { BorderRadius, FontWeight, Spacing } from "shared/styles/styles"
import { ToolbarOrderBy, ToolbarOrderIn } from "staff-app/daily-care/home-board.page"

export type ToolbarAction = string
export type ToolbarInput = string

interface ToolbarProps {
    onItemClick: (action: ToolbarAction, value?: string) => void,
    onInput: (action: ToolbarInput, value?: string) => void,
    onSelectOrderIn: (value: ToolbarOrderIn) => void,
    onSelectOrderBy: (value: ToolbarOrderBy) => void
}

export const Toolbar: React.FC<ToolbarProps> = (props) => {
    const { onItemClick, onInput, onSelectOrderBy, onSelectOrderIn } = props

    return (
        <S.ToolbarContainer>
            <Box>
                {/* Order In  */}
                <S.Select defaultValue={"none"} onChange={(event) => onSelectOrderIn(event.target.value as ToolbarOrderIn)}>
                    <S.Option value={"none"} disabled >Order In</S.Option>
                    <S.Option value={"ascending"} >Ascending</S.Option>
                    <S.Option value={"descending"}>Descending</S.Option>
                </S.Select>
                {/* Order By  */}
                < S.Select defaultValue={"none"} onChange={(event) => onSelectOrderBy(event.target.value as ToolbarOrderBy)}>
                    <S.Option value={"none"} disabled >Order By</S.Option>
                    <S.Option value={"first_name"} >First Name</S.Option>
                    <S.Option value={"last_name"}>Last Name</S.Option>
                </S.Select >
            </Box >
            {/* search box  */}
            < S.SearchBar type="text" name="Search Bar" id="search-bar" placeholder="Search" onChange={(event) => onInput(event.target.value)} />
            {/* Roll  */}
            <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
        </S.ToolbarContainer >
    )
}



const S = {
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
  }`
}
