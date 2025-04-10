import dayjs from 'dayjs'
import { Lunar } from 'lunar-javascript'  // Change this line

interface Holiday {
  name: string
  date: string | ((year: number) => string) // 支持固定日期或动态计算函数
  type: 'solar' | 'lunar' // 区分阳历和农历
}

export const holidays: Holiday[] = [
  { name: '元旦', date: '01-01', type: 'solar' },
  {
    name: '春节',
    date: (year: number) => {
      const lunar = Lunar.fromYmd(year, 1, 1) // 农历正月初一
      const solar = lunar.getSolar()
      return `${solar.getMonth().toString().padStart(2, '0')}-${solar
        .getDay()
        .toString()
        .padStart(2, '0')}`
    },
    type: 'lunar',
  },
  {
    name: '清明',
    date: (year: number) => {
      const lunar = Lunar.fromDate(new Date(year, 3, 1))
      const solarTerm = lunar.getJieQiTable()['清明']
      return `04-${solarTerm.getDay().toString().padStart(2, '0')}`
    },
    type: 'solar',
  },
  { name: '劳动', date: '05-01', type: 'solar' },
  {
    name: '端午',
    date: (year: number) => {
      const lunar = Lunar.fromYmd(year, 5, 5) // 农历五月初五
      const solar = lunar.getSolar()
      return `${solar.getMonth().toString().padStart(2, '0')}-${solar
        .getDay()
        .toString()
        .padStart(2, '0')}`
    },
    type: 'lunar',
  },
  {
    name: '中秋',
    date: (year: number) => {
      const lunar = Lunar.fromYmd(year, 8, 15) // 农历八月十五
      const solar = lunar.getSolar()
      return `${solar.getMonth().toString().padStart(2, '0')}-${solar
        .getDay()
        .toString()
        .padStart(2, '0')}`
    },
    type: 'lunar',
  },
  { name: '国庆', date: '10-01', type: 'solar' },
]

export const getHoliday = (date: dayjs.Dayjs): string => {
  const year = date.year()
  const dateStr = date.format('MM-DD')

  const holiday = holidays.find((h) => {
    if (typeof h.date === 'string') {
      return h.date === dateStr
    } else {
      return h.date(year) === dateStr
    }
  })

  return holiday ? holiday.name : ''
}
