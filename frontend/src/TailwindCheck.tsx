
/**
 * TailwindCheck Component
 * This is a simple test component to verify if Tailwind CSS is correctly installed and working.
 * If Tailwind is working, you will see:
 * 1. A blue background gradient.
 * 2. A centered white card with rounded corners and a shadow.
 * 3. Text that is colored and has a hover effect.
 */
function TailwindCheck() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transition-transform hover:scale-105 duration-300">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                    Tailwind CSS Test
                </h2>

                <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                        If you see a <span className="text-blue-600 font-semibold">blue-to-purple gradient</span> background and this card is <span className="font-semibold">centered</span> with a shadow, then...
                    </p>

                    <div className="py-3 px-6 bg-green-100 text-green-800 rounded-full font-bold text-lg inline-block animate-bounce">
                        Tailwind is working! 🚀
                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                        <div className="w-12 h-12 bg-red-500 rounded-full shadow-lg hover:rotate-45 transition-transform duration-300 cursor-pointer"></div>
                        <div className="w-12 h-12 bg-yellow-500 rounded-lg shadow-lg hover:-rotate-12 transition-transform duration-300 cursor-pointer"></div>
                        <div className="w-12 h-12 bg-blue-500 rounded-sm shadow-lg hover:skew-x-12 transition-transform duration-300 cursor-pointer"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TailwindCheck;
