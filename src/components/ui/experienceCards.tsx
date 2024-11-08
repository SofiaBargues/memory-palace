import * as React from "react";

const ExperienceCard = ({ title, description, Icon }) => {
  return (
    <div className=" bg-white shadow-lg rounded-lg col-span-1 sm:col-span-1">
      <div className=" p-6">
        <div className="mb-4 text-center">
          <span className="inline-block p-3 bg-primary/10 rounded-full">
            <Icon className="h-6 w-6" />
          </span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-center">{title}</h3>
        <p className="text-muted-foreground text-center">{description}</p>
      </div>
    </div>
  );
};

export default ExperienceCard;
