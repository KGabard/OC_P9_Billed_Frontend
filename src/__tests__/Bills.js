/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from '@testing-library/dom'
import BillsUI from '../views/BillsUI.js'
// import { bills } from '../fixtures/bills.js'
import { ROUTES_PATH } from '../constants/routes.js'
import { localStorageMock } from '../__mocks__/localStorage.js'
import '@testing-library/jest-dom'

import router from '../app/Router.js'
import { formatDate, formatStatus } from '../app/format.js'
import Bills from '../containers/Bills.js'
import userEvent from '@testing-library/user-event'

import mockStore from '../__mocks__/store.js'

describe('Given I am connected as an employee', () => {
  describe('When I am on Bills Page', () => {
    let bills

    test('Then bill icon in vertical layout should be highlighted', async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem(
        'user',
        JSON.stringify({
          type: 'Employee',
        })
      )
      const root = document.createElement('div')
      root.setAttribute('id', 'root')
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toHaveClass('active-icon')
    })

    test('fetches bills from mock API GET', async () => {
      bills = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage,
      })
      const billsList = await bills.getBills()
      expect(billsList).toHaveLength(4)
      expect(billsList[0].id).toBe('47qAXb6fIm2zOKkLzMro')
      expect(billsList[1].id).toBe('UIUZtnPQvnbFnB0ozvJh')
      expect(billsList[2].id).toBe('qcCK3SzECmaZAGRrHjaC')
      expect(billsList[3].id).toBe('BeKy5Mo4jkmdfPGYpTxZ')
    })

    test('should catch an error if corrupted data was introduced while fetches bills from mock API GET', async () => {
      jest.spyOn(mockStore, 'bills')

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.resolve([
              {
                date: 'Not good date format',
                status: 'pending',
              },
              {
                date: 'Not good date format',
                status: 'refused',
              },
            ])
          },
        }
      })

      const billsList = await bills.getBills()
      expect(billsList[0].date).toBe('Not good date format')
      expect(billsList[0].status).toBe('En attente')
      expect(billsList[1].date).toBe('Not good date format')
      expect(billsList[1].status).toBe('Refusé')
    })

    test('should fails with a 404 error while fetches bills from mock API GET', async () => {
      jest.spyOn(mockStore, 'bills')

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error('Erreur 404'))
          },
        }
      })
      let errorMessage
      try {
        await bills.getBills()
      } catch (error) {
        errorMessage = error.message
      }
      expect(errorMessage).toBe('Erreur 404')
    })

    test('should fails with a 500 error while fetches bills from mock API GET', async () => {
      jest.spyOn(mockStore, 'bills')

      mockStore.bills.mockImplementationOnce(() => {
        return {
          list: () => {
            return Promise.reject(new Error('Erreur 500'))
          },
        }
      })
      let errorMessage
      try {
        await bills.getBills()
      } catch (error) {
        errorMessage = error.message
      }
      expect(errorMessage).toBe('Erreur 500')
    })

    test('Then bills should be ordered from earliest to latest', async () => {
      const billsList = await bills.getBills()
      document.body.innerHTML = BillsUI({ data: billsList })
      const dates = screen
        .getAllByText(
          /\d{1,2} (Jan\.|Fév\.|Mar\.|Avr\.|Mai\.|Jun\.|Jul\.|Aoû\.|Sep\.|Oct\.|Nov\.|Déc\.) \d{2}/i
        )
        .map((a) => a.innerHTML)
      const antiChrono = (a, b) => (a < b ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    test('Then click on icon-eye should open modale file', () => {
      const iconEyeElmts = document.querySelectorAll("[data-testid='icon-eye']")
      const modaleFileElmt = document.querySelector('#modaleFile')

      new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage,
      })

      userEvent.click(iconEyeElmts[0])
      expect(modaleFileElmt).toHaveClass('show')
    })
  })
})
