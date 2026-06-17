import React from 'react';
import Image from 'next/image';

interface TechItem {
  label: string;
}

interface TechColumn {
  iconImage: string;
  title: string;
  items: TechItem[];
}

interface StaffingTechnologiesContent {
  heading?: string;
  columns?: TechColumn[];
}

interface StaffingTechnologiesProps {
  content?: StaffingTechnologiesContent;
}

export function StaffingTechnologies({ content }: StaffingTechnologiesProps) {
  const heading = content?.heading || "The various technologies for which\nESS provides services are:";

  const defaultColumns: TechColumn[] = [
    {
      iconImage: "/Staffing Services/analytics-business-chart-finance-graph-money_svgrepo.com.png",
      title: "Business Intelligence (ETL)",
      items: [
        { label: "Manual Testing, JIRA" },
        { label: "PRM Analyst" },
        { label: "WFM Analyst" },
        { label: "Non-ITs" },
        { label: "Talend (BI-DWH)" },
        { label: "Scrum Master" },
        { label: "Java, Microservices" },
        { label: "Solution Engineer" },
      ]
    },
    {
      iconImage: "/Staffing Services/robot_svgrepo.com.png",
      title: "Ui Path, Automation Anywhere",
      items: [
        { label: "Oracle ADF" },
        { label: "Oracle Apex" },
        { label: "UI-React.js" },
        { label: "PMP" },
        { label: "Oracle Developer 2000" },
        { label: "Java" },
        { label: "PL/SQL" },
        { label: "Dev Leads" },
      ]
    },
    {
      iconImage: "/Staffing Services/python-icon-new.png",
      title: "Python",
      items: [
        { label: "Angular" },
        { label: ".Net" },
        { label: "Manual tester (lead)" },
        { label: "Odoo" },
        { label: "Cloud Infra/AWS" },
        { label: "Infra/AWS Infra" },
        { label: "Cloud Engineers" },
        { label: "Automation" },
      ]
    }
  ];

  const columns = content?.columns || defaultColumns;

  const headerBgs = [
    "bg-[#f8f5fe] text-slate-900",
    "bg-[#f2f8ff] text-slate-900",
    "bg-[#f2fcf5] text-slate-900"
  ];

  const iconBgs = [
    "bg-[#6c48ff]", // Purple for BI
    "bg-[#328bf6]", // Blue for UI Path
    "bg-[#33c46e]"  // Green for Python
  ];

  const dotColors = [
    "bg-[#6c48ff]",
    "bg-[#328bf6]",
    "bg-[#33c46e]"
  ];

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 whitespace-pre-line">
            {heading}
          </h2>
          <div className="w-16 h-0.5 bg-[#2a2d7c] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm">
          {columns.map((col, idx) => {
            const headerBg = headerBgs[idx % headerBgs.length];
            const iconBg = iconBgs[idx % iconBgs.length];
            const dotColor = dotColors[idx % dotColors.length];
            return (
              <div key={idx} className="flex flex-col border-r border-slate-200 last:border-r-0 border-b md:border-b-0 last:border-b-0">
                {/* Header */}
                <div className={`flex items-center gap-4 px-6 py-5 border-b border-slate-200 ${headerBg}`}>
                  <div className={`w-12 h-12 relative flex-shrink-0 rounded-xl overflow-hidden ${iconBg} p-2.5 shadow-sm`}>
                    <Image src={col.iconImage || (col as any).icon} alt={col.title} fill className="object-contain p-2.5" />
                  </div>
                  <h3 className="font-bold text-base md:text-lg">{col.title}</h3>
                </div>

                {/* List */}
                <div className="flex flex-col">
                  {col.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="flex items-center gap-4 px-6 py-4 border-b border-slate-200 last:border-b-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      <span className="text-slate-600 text-sm font-semibold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
