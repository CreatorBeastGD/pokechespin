import React from "react";
import TypeBadge from "./TypeBadge";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const WeaknessResistanceTable: React.FC<{ weaknesses: { [key: string]: number } }> = ({ weaknesses }) => {
  return (
    <>
        <Card className="mt-2 mb-2">
            <CardHeader>
                <CardTitle>Type Weaknesses and Resistances</CardTitle>
            </CardHeader>
            <CardContent >
                <div className="flex flex-row mb-1">
                    <span className={`inline-block rounded-xl text-xs font-bold text-white px-3 py-1 bg-red-600 w-[20%]`}>x2.56</span>
                    <div className="ml-1 w-[80%]">
                        {Object.entries(weaknesses).map(([type, multiplier]) => (
                        multiplier > 1.6 ? (
                        <span className="mr-1" key={type}> <TypeBadge  type={type}/></span>
                        ) : null
                        ))}
                    </div>
                </div>
            
                <div className="flex flex-row mb-1">
                    <span className={`inline-block rounded-xl text-xs font-bold text-white px-3 py-1 bg-red-400 w-[20%]`}>x1.6</span>
                    <div className="ml-1 w-[80%]">
                        {Object.entries(weaknesses).map(([type, multiplier]) => (
                        multiplier > 1.2 && multiplier <= 1.6 ? (
                        <span className="mr-1" key={type}> <TypeBadge  type={type}/></span>
                        ) : null
                        ))}
                    </div>
                </div>
            
                <div className="flex flex-row mb-1">
                    <span className={`inline-block rounded-xl text-xs font-bold text-white px-3 py-1 bg-green-200 w-[20%]`}>x0.625</span>
                    <div className="ml-1 w-[80%]">
                        {Object.entries(weaknesses).map(([type, multiplier]) => (
                        multiplier < 0.7 && multiplier > 0.6 ? (
                        <span className="mr-1" key={type}> <TypeBadge  type={type}/></span>
                        ) : null
                        ))}
                    </div>
                </div>
            
                <div className="flex flex-row mb-1">
                    <span className={`inline-block rounded-xl text-xs font-bold text-white px-3 py-1 bg-green-400 w-[20%]`}>x0.39</span>
                    <div className="ml-1 w-[80%]">
                        {Object.entries(weaknesses).map(([type, multiplier]) => (
                        multiplier < 0.5 && multiplier > 0.3 ? (
                        <span className="mr-1" key={type}> <TypeBadge  type={type}/></span>
                        ) : null
                        ))}
                    </div>
                </div>
            
                <div className="flex flex-row mb-1">
                    <span className={`inline-block rounded-xl text-xs font-bold text-white px-3 py-1 bg-green-600 w-[20%]`}>x0.244</span>
                    <div className="ml-1 w-[80%]">
                        {Object.entries(weaknesses).map(([type, multiplier]) => (
                        multiplier <= 0.3 ? (
                        <span className="mr-1" key={type}> <TypeBadge  type={type}/></span>
                        ) : null
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    </>
  );
};

export default WeaknessResistanceTable;