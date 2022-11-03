import Link from "next/link" 

export async function getStaticProps()
{
  const response = await fetch('http://localhost:8080/graphql' , {
        method:'POST',
        headers:{'content-type' : 'application/json'},
        body:JSON.stringify({
          query:`
          query NewQuery {
            posts {
              edges {
                node {
                  date
                  title
                  uri
                  id
                  slug
                  content
                }
              }
            }
          }
          `
        })
      }) 
  const json = await response.json();

  console.log(json.data.posts.edges)

  return {
    props:{
      posts:json.data.posts.edges,
    },

  }
}

export default function Home({posts}) {
  console.log(posts);
  return (
    <div>
        <h1>
          Graphql !!
        </h1>
      <div>
        {
          posts.map((post) => {
            return (
              <ul key={post.node.slug}>
                <li>
                  <Link href={`/posts/${post.node.slug}`}>{post.node.title}</Link>
                </li>
              </ul>
            )
          })
        }
      </div>
    </div>
  )
}
