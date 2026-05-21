import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="page-section flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="surface-panel w-full max-w-xl rounded-[2rem] p-10 sm:p-12">
        <p className="font-display text-8xl font-bold tracking-tight text-primary sm:text-[7rem]">404</p>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
