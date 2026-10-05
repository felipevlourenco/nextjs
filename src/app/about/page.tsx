export default function About() {
  console.log('<========================================');
  console.log('Rendering About...');
  console.log('========================================>');

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
        About Page
      </h1>
      <p className="mt-4 text-lg text-zinc-700 dark:text-zinc-300">
        This is the about page of the application.
      </p>
    </div>
  );
}
