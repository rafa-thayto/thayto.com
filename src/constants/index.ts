import path from 'path'

export const POSTS_PATH = 'posts'
export const getPostsPath = (locale: string) =>
  path.join(process.cwd(), 'posts', locale)

export const getYearsOfProfessionalExperience = () => {
  const startDate = new Date(2018, 11, 18)
  const currentDate = new Date()
  const anniversaryThisYear = new Date(
    currentDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
  )

  const years = currentDate.getFullYear() - startDate.getFullYear()
  return currentDate < anniversaryThisYear ? years - 1 : years
}
