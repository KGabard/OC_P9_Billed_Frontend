import VerticalLayout from './VerticalLayout.js'
import ErrorPage from './ErrorPage.js'
import LoadingPage from './LoadingPage.js'

import Actions from './Actions.js'

const row = (bill) => {
  return `
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `
}

const convertDate = (dateString) => {
  // Split the date string into its component parts
  const [day, month, year] = dateString.split(' ')

  // Map the month name to a month number
  const months = {
    'Jan.': '01',
    'Fév.': '02',
    'Mar.': '03',
    'Avr.': '04',
    'Mai.': '05',
    'Jun.': '06',
    'Jul.': '07',
    'Aoû.': '08',
    'Sep.': '09',
    'Oct.': '10',
    'Nov.': '11',
    'Déc.': '12',
  }

  // Use the month number to construct the ISO-8601 date string
  // return `${year}-${months[month]}-${day}`;
  return [parseInt(year), parseInt(months[month]), parseInt(day)]
}

const sortByDateDescending = (array) => {
  array.sort((a, b) => {
    const dateA = convertDate(a.date)
    const dateB = convertDate(b.date)
    const valueDateA = new Date(dateA[0], dateA[1] - 1, dateA[2]).getTime()
    const valueDateB = new Date(dateB[0], dateB[1] - 1, dateB[2]).getTime()
    return valueDateB - valueDateA
  })
}

const rows = (data) => {
  if (!data || !data.length) return
  sortByDateDescending(data)
  return data.map((bill) => row(bill)).join('')
}

export default ({ data: bills, loading, error }) => {
  const modal = () => `
    <div class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }

  return `
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
}
