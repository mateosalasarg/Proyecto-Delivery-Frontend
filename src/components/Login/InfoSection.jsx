import React from "react";

const InfoSection = ({ title, description, buttonText, onToggle }) => {
  return (
    <div className="information">
      <div className="info-childs">
        <h2>{title}</h2>
        <p>{description}</p>
        <input type="button" value={buttonText} onClick={onToggle} />
      </div>
    </div>
  );
};

export default InfoSection;
