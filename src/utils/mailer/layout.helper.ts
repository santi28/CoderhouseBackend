import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

export enum Layouts {
  NEW_REGISTER = 'new_register',
  FORGOT_PASSWORD = 'forgot_password',
  NEW_ORDER = 'new_order'
}

interface LayoutDataMap {
  [Layouts.NEW_REGISTER]: NewRegisterData
  [Layouts.FORGOT_PASSWORD]: ForgotPasswordData
  [Layouts.NEW_ORDER]: NewOrderData
}

interface NewRegisterData {
  name: string
  email: string
  phone: string
  role: string
}

interface ForgotPasswordData {
  name: string
  email: string
  url: string
}

interface NewOrderData {
  name: string
  order_number: number
}

export function getCompiledTemplate (layout: Layouts) {
  const layoutSource = fs.readFileSync(
    path.join(__dirname, `../../../public/mails/${layout}.layout.hbs`),
    'utf8'
  )

  return handlebars.compile(layoutSource)
}

export default function getCompiledHTML<T extends Layouts> (
  layout: T,
  data: LayoutDataMap[T]
) {
  const template = getCompiledTemplate(layout)
  return template(data)
}
