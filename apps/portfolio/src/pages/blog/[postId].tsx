import { Footer } from '@src/components/Footer'
import { Header } from '@src/components/Header'
import { GetServerSideProps } from 'next'

interface Props {
  post: {
    name: string
  }
}

const PostsPage = ({ post }: Props) => (
  <>
    <main>
      <Header />
      <h1>Post: {post.name}</h1>
    </main>
    <Footer />
  </>
)

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const post = { name: query.postId as string }

  return {
    props: {
      post,
    },
  }
}

export default PostsPage
