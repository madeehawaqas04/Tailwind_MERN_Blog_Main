import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';

const projects = [
  { id: 1, title: "Phone Verification", slug: "/",image:"https://firebasestorage.googleapis.com/v0/b/shop-5a25b.appspot.com/o/1711434805727otpVerification.png?alt=media&token=c4a95a5d-0d1c-4eba-b8b6-6db14688f8e0",desc:"test" },
  { id: 2, title: "Phone Verification", slug: "/menu",image:"https://firebasestorage.googleapis.com/v0/b/shop-5a25b.appspot.com/o/1711434900336phoneVerification.png?alt=media&token=5ddf8960-6bab-475a-a24e-9ed534608784",desc:"test" },
  { id: 3, title: "Phone Verification", slug: "/",image:"https://firebasestorage.googleapis.com/v0/b/shop-5a25b.appspot.com/o/1711434900336phoneVerification.png?alt=media&token=5ddf8960-6bab-475a-a24e-9ed534608784",desc:"test" },
  { id: 4, title: "Phone Verification", slug: "/" ,image:"https://firebasestorage.googleapis.com/v0/b/shop-5a25b.appspot.com/o/1711434805727otpVerification.png?alt=media&token=c4a95a5d-0d1c-4eba-b8b6-6db14688f8e0",desc:"test"},
];

export default function Projects() {
  return (
    <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 py-2'>
      <h1 className='text-3xl font-semibold'>Projects</h1>
      <p className='text-md text-gray-500'>Build fun and engaging projects while learning Reactjs, HTML, CSS, and JavaScript, MongoDB!</p>
      <div className='flex flex-col gap-6'>
     <div className='flex flex-wrap gap-4 justify-center'> 
     {
          projects.map((items) => (
     <div key={items.id}  className='group relative w-full shadow-md hover:border-2 h-[400px] overflow-hidden rounded-lg
    md:w-[46vw] xl:w-[40vw] transition-all'>
      <Link to={`/post/${items.slug}`}>
        <img
          src={items.image}
          alt='post cover'
          className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link>
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{items.title}</p>
        <span className='italic text-sm'>{items.desc}</span>
        <Link
          to={`/post/${items.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
))}
     </div>
     </div>
    </div>
  )
}