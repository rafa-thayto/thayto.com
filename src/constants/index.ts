import path from 'path'

export const POSTS_PATH = 'posts'
export const getPostsPath = (locale: string) =>
  path.join(process.cwd(), 'posts', locale)

export const getYearsOfProfessionalExperience = () => {
  const startDate = new Date(2018, 11)
  const currentDate = new Date()

  let years = currentDate.getFullYear() - startDate.getFullYear()

  if (currentDate.getMonth() < startDate.getMonth()) {
    years--
  }

  return years
}
