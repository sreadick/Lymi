import React from 'react';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div className="page">
      {/* <div className="page-content"> */}
        <div className="boxed-view">
          <div className="boxed-view__box">
            <h1>404 - Page Not Found</h1>
            <p>Hmmm, We're unable to find that page</p>
            <Link to='/' className="button button--link">HEAD HOME</Link>
          </div>
        </div>
      {/* </div> */}
    </div>

  );
};
