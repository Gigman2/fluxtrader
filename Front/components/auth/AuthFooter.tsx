import React from "react";
import { Link } from "react-router-dom";

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkTo: string;
}

const AuthFooter: React.FC<AuthFooterProps> = ({ text, linkText, linkTo }) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
      <p className="text-sm text-slate-500">
        {text}{" "}
        <Link
          to={linkTo}
          className="font-bold text-slate-900 dark:text-white hover:underline"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthFooter;

