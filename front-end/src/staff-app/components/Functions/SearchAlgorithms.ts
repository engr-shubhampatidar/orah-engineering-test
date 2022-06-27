import { Person } from "shared/models/person";

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
