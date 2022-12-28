/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from '@testing-library/dom'
import NewBillUI from '../views/NewBillUI.js'
import NewBill from '../containers/NewBill.js'
import { ROUTES_PATH } from '../constants/routes.js'
import { localStorageMock } from '../__mocks__/localStorage.js'
import router from '../app/Router.js'

import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import mockedStore from '../__mocks__/store.js'

describe('Given I am connected as an employee', () => {
  describe('When I am on NewBill Page', () => {
    let newBill

    test('Then mail icon in vertical layout should be highlighted', async () => {
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
      window.onNavigate(ROUTES_PATH.NewBill)
      await waitFor(() => screen.getByTestId('icon-mail'))
      const windowIcon = screen.getByTestId('icon-mail')
      expect(windowIcon).toHaveClass('active-icon')
    })

    test('Then fill the new bill form should be possible', () => {
      newBill = new NewBill({
        document,
        onNavigate,
        store: mockedStore,
        localStorage,
      })

      expect(screen.getByTestId('form-new-bill')).toBeTruthy()

      const expenseTypeInput = screen.getByTestId('expense-type')
      const expenseNameInput = screen.getByTestId('expense-name')
      const expenseDateInput = screen.getByTestId('datepicker')
      const expenseAmountInput = screen.getByTestId('amount')
      const expenseVatInput = screen.getByTestId('vat')
      const expensePctInput = screen.getByTestId('pct')
      const expenseCommentaryInput = screen.getByTestId('commentary')
      const expenseFileInput = screen.getByTestId('file')

      fireEvent.change(expenseTypeInput, {
        target: { value: 'Services en ligne' },
      })
      fireEvent.change(expenseNameInput, { target: { value: 'Ma dépense' } })
      fireEvent.change(expenseDateInput, { target: { value: '2018-11-19' } })
      fireEvent.change(expenseAmountInput, { target: { value: '250' } })
      fireEvent.change(expenseVatInput, { target: { value: '50' } })
      fireEvent.change(expensePctInput, { target: { value: '20' } })
      fireEvent.change(expenseCommentaryInput, { target: { value: 'RAS' } })
      const testFile = new File(['image data'], 'image.png', {
        type: 'image/png',
      })

      jest.spyOn(newBill, 'isFileExtensionValid').mockReturnValueOnce(true)
      fireEvent.change(expenseFileInput, { target: { files: [testFile] } })

      expect(expenseTypeInput.value).toBe('Services en ligne')
      expect(expenseNameInput.value).toBe('Ma dépense')
      expect(expenseDateInput.value).toBe('2018-11-19')
      expect(expenseAmountInput.value).toBe('250')
      expect(expenseVatInput.value).toBe('50')
      expect(expensePctInput.value).toBe('20')
      expect(expenseCommentaryInput.value).toBe('RAS')
      expect(expenseFileInput.files[0]).toEqual(testFile)
    })

    test('Change file should catch an error if the create bill method throw one', async () => {
      jest.spyOn(mockedStore, 'bills')

      mockedStore.bills.mockImplementationOnce(() => {
        return {
          create: () => {
            return Promise.reject(new Error('Random error'))
          },
        }
      })

      const expenseFileInput = screen.getByTestId('file')
      const testFile = new File(['image data'], 'image.png', {
        type: 'image/png',
      })

      jest.spyOn(newBill, 'isFileExtensionValid').mockReturnValueOnce(true)
      console.log('AVANT')
      fireEvent.change(expenseFileInput, { target: { files: [testFile] } })
    })

    test('Then submit form should be possible', async () => {
      const formElmt = screen.getByTestId('form-new-bill')
      fireEvent.submit(formElmt)

      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon).toHaveClass('active-icon')
    })
  })
})
