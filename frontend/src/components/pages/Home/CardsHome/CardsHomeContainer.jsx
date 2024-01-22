import React from "react";
import { CardsHomeView } from "./CardsHomeView";
import { TiTick } from "react-icons/ti";
import { FaMessage } from "react-icons/fa6";
import { FaCalendarTimes } from "react-icons/fa";
export function CardsHomeContainer({ responsiveData }) {
  let activesCount = 0,
    notifCount = 0,
    expiredCount = 0;
  responsiveData.forEach((responsive) => {
    console.log(responsive.state_id_fk);
    if (responsive.state_id_fk == 1) {
      activesCount++;
    } else if (responsive.state_id_fk == 2) {
      notifCount++;
    } else {
      expiredCount++;
    }
  });

  const cards = [
    {
      title: "Activas",
      content: (
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-success rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "40px", height: "40px" }}
          >
            <h2 className="link-light">
              <TiTick />
            </h2>
          </div>
          <h2>{activesCount}</h2>
        </div>
      ),
    },
    {
      title: "Notificar",
      content: (
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-warning rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "40px", height: "40px" }}
          >
            <h2 className="link-light fs-5">
              <FaMessage />
            </h2>
          </div>
          <h2>{notifCount}</h2>
        </div>
      ),
    },
    {
      title: "Expiradas",
      content: (
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-danger rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "40px", height: "40px" }}
          >
            <h2 className="link-light fs-4">
              <FaCalendarTimes />
            </h2>
          </div>
          <h2>{expiredCount}</h2>
        </div>
      ),
    },
  ];

  return <CardsHomeView cards={cards} />;
}
