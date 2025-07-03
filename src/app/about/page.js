import React from 'react';
import Customerheader from '../_component/customerheader';
import Restaurantfooter from '../_component/restaurantfooter';

function Aboutpage() {
  return (
    <>
      <Customerheader />
      <div className="bg-rose-50 min-h-screen py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-rose-600 mb-6">About QuickServe</h1>
          <p className="text-lg text-gray-700 mb-4">
            <strong>QuickServe</strong> is a fast and simple food delivery app built to connect users with local restaurants.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            Created by <span className="font-semibold text-xl text-rose-500">Kamlesh Satpute</span>, a full-stack developer passionate about user experience and modern web tech.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            From smooth ordering to restaurant dashboards — everything is built with performance and simplicity in mind.
          </p>
          <p className="text-lg text-gray-800 font-medium mb-4">
            Thanks for visiting! 🚀
          </p>
          <p className="text-lg">
            View my Github Profile{' '}
            <a
              href="https://github.com/Kamlesh-Creates"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-600 font-semibold underline hover:text-rose-800"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
      <Restaurantfooter />
    </>
  );
}

export default Aboutpage;
