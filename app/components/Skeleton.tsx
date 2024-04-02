import React from "react";

function Skeleton({ count = 10 }) {
  return (
    <div
      role="status"
      className="max-w-md p-4 space-y-4 border  divide-y  rounded shadow animate-pulse divide-linesLight md:p-6 border-linesLight"
    >
      {[...Array(count).keys()].map((val, idx) => {
        return (
          <div key={idx} className="flex items-center justify-between py-4">
            <div>
              <div className="h-2.5 bg-linesLight rounded-full  w-24 mb-2.5"></div>
              <div className="w-32 h-2 bg-linesLight rounded-full"></div>
            </div>
            <div className="h-2.5 bg-linesLight rounded-full w-12"></div>
          </div>
        );
      })}

      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Skeleton;
