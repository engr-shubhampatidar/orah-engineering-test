import { Person } from "shared/models/person";
import { RollInput } from "shared/models/roll";

export function SearchAlgorithms( input: string, data: Person[]) {
    const filterData: Person[] = [];
    data.map((student: Person) => {
      if (student.first_name.toLowerCase().includes(input.toLowerCase().replace(/ /g, ''))) {
        filterData.unshift(student)
      } else if (student.last_name.toLowerCase().includes(input.toLowerCase().replace(/ /g, ''))) {
        filterData.push(student)
      } else {
        if (student.first_name.concat(student.last_name).toLowerCase()
          .includes(input.toLowerCase().replace(/ /g, ''))) {
          filterData.push(student)
        }
      }
    })
    return filterData;
}

export function getAttendence (data: RollInput) {
  let all = 0; let absent = 0; let late = 0; let present = 0;
  data.student_roll_states.map((student) => {
        if (student.roll_state === "present") {
          present += 1;
        }
        if (student.roll_state === "late") {
          late += 1;
        }
        if (student.roll_state === "absent") {
          absent += 1;
        }
        all += 1;
      })
  return {all, absent, late, present}
}