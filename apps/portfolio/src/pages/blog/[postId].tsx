import { GetServerSideProps } from 'next'

interface Props {
  post: {
    name: string
  }
}

const PostsPage = ({ post }: Props) => (
  <main>
    <h1>Post: {post.name}</h1>
  </main>
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
