import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from '../app/format.js'
import Logout from './Logout.js'

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
    'Jui.': '06',
    'Jui.': '07',
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
    console.log(a.date);
    console.log(b.date);
    console.log(dateA);
    console.log(dateB);
    console.log(valueDateA);
    console.log(valueDateB);
    return valueDateB - valueDateA
  })
}

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(
      `button[data-testid="btn-new-bill"]`
    )
    if (buttonNewBill)
      buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener('click', () => this.handleClickIconEye(icon))
      })
    new Logout({ document, localStorage, onNavigate })
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }

  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute('data-bill-url')
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
    $('#modaleFile')
      .find('.modal-body')
      .html(
        `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`
      )
    if (typeof $('#modaleFile').modal === 'function') {
      $('#modaleFile').modal('show')
    } else {
      $('#modaleFile').addClass('show')
    }
  }

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => {
            try {
              return {
                ...doc,
                date: formatDate(doc.date),
                status: formatStatus(doc.status),
              }
            } catch (e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e, 'for', doc)
              return {
                ...doc,
                date: doc.date,
                status: formatStatus(doc.status),
              }
            }
          })
          // console.log('length', bills.length)
          sortByDateDescending(bills)
          return bills
        })
    }
  }
}
