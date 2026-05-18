import React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li className="flex items-center">
          <Link
            to="/"
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-outline mx-1" />
            {item.to ? (
              <Link
                to={item.to}
                className="text-label-md font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-label-md font-bold text-on-surface">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
