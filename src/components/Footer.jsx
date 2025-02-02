import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-violet-900 text-white py-12'>
      <div className='max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8'>
        <div>
          <h4 className='text-xl font-bold mb-4'>Merry Berry</h4>
          <p className='text-gray-300'>
            Fresh, healthy, and delicious smoothies & bowls
          </p>
        </div>
        <div>
          <h4 className='text-xl font-bold mb-4'>Quick Links</h4>
          <ul className='space-y-2 text-gray-300'>
            <li>
              <Link to='/menu' className='hover:text-white'>
                Menu
              </Link>
            </li>
            <li>
              <Link to='/about' className='hover:text-white'>
                About
              </Link>
            </li>
            <li>
              <Link to='/contact' className='hover:text-white'>
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-xl font-bold mb-4'>Legal</h4>
          <ul className='space-y-2 text-gray-300'>
            <li>
              <Link to='/privacy' className='hover:text-white'>
                Privacy
              </Link>
            </li>
            <li>
              <Link to='/terms' className='hover:text-white'>
                Terms
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-xl font-bold mb-4'>Connect</h4>
          <div className='flex space-x-4'>{/* Social media icons */}</div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
