const Output = ({ output, isError }: { output: string; isError: boolean }) => {
    return (
        <div className='h-[300px] absolute bottom-0 left-0 w-full bg-neutral-200 dark:bg-neutral-800 border-t-2 border-neutral-300 dark:border-neutral-700 text-zinc-900 dark:text-zinc-100'>
            <div className='p-5'>
                {output ? output : "Click 'Run Code' to see the output"}
                {isError ? isError : null}
            </div>
        </div>
    );
};

export default Output;
