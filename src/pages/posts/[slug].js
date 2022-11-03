import Image from "next/image";

const Post = (post) => {

    console.log('Single post : ' , post);

    const data = post.post;
    return ( 
            <div className="text-2xl">
                Get single post by Slug : 
                <div>
                    <h1>{data.slug}</h1><hr />
                    <h1>{data.title}</h1><hr />
                    <h1>{data.uri}</h1><hr />
                    <div dangerouslySetInnerHTML={{__html :data.content}}></div>
                   

                   {/* Next to fix error if i use component image */}
                    {/* <Image width="290" height="402" src={data.featuredImage.node.sourceUrl} /> */}
                </div>
            </div>
     );
}
 
export default Post;


export async function getStaticPaths(){

    const res = await fetch('http://localhost:8080/graphql' , {
        method:'POST',
        headers:{'Content-Type' : 'application/json'},
        body:JSON.stringify({
            query:  `
            query allPosts{
                posts {
                    nodes {
                        id
                        title
                        slug
                        content
                    }
                }
            }
        `
        })
        
    })
    const json = await res.json();

    console.log('Data in Json : ' , json);

    const posts = json.data.posts;

    console.log('all posts :' , posts);

    const paths = posts.nodes.map((post)=>({

        params:{slug: post.slug},


    }))

    return { paths , fallback:false }
}

export async function getStaticProps(context)
{
    const response = await fetch('http://localhost:8080/graphql' , {
        method: 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({
            query:`
                query SinglePost ($id: ID! , $idType: PostIdType!){
                    post(id: $id , idType: $idType )
                        {
                    title
                    slug
                    content
                    uri
                    featuredImage{
                            node{
                                sourceUrl
                            }
                        }
                    } 
                }

            `,
            variables:{
                id:context.params.slug ,
                idType: 'SLUG',
            }
        })

    })
    const json = await response.json();


    return {

        props:{
            post :json.data.post,
        }
    }
}

