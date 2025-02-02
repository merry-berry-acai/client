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
              <a href='/menu' className='hover:text-white'>
                Menu
              </a>
            </li>
            <li>
              <a href='/about' className='hover:text-white'>
                About
              </a>
            </li>
            <li>
              <a href='/contact' className='hover:text-white'>
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className='text-xl font-bold mb-4'>Legal</h4>
          <ul className='space-y-2 text-gray-300'>
            <li>
              <a href='/privacy' className='hover:text-white'>
                Privacy
              </a>
            </li>
            <li>
              <a href='/terms' className='hover:text-white'>
                Terms
              </a>
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
