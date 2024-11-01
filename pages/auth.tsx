import Input from "@/components/input";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

const Auth = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Стан для видимості пароля
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [variant, setVariant] = useState('login');

    const toggleVariant = useCallback(() => {
        setVariant((currentVariant) => currentVariant === 'login' ? 'register' : 'login');
        setError(null);
        setShowError(false);
    }, []);

    const handleAuth = () => {
        setShowError(false);

        if (variant === 'register') {
            const user = { email, password, name };
            localStorage.setItem('user', JSON.stringify(user));
            setError('Account created! You can now log in.');
            setVariant('login');
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.email === email && parsedUser.password === password) {
                    setError('Login successful!');
                    setTimeout(() => {
                        router.push("/");
                    }, 1000);
                } else {
                    setError('Invalid email or password');
                }
            } else {
                setError('No account found. Please register first.');
            }
        }

        setTimeout(() => {
            setShowError(true);
        }, 10);
    };

    useEffect(() => {
        if (!error) {
            setShowError(false);
        }
    }, [error]);

    return (
        <div className="relative h-full w-full bg-[url(/images/hero.jpg)] bg-no-repeat bg-center bg-fixed bg-cover">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/images/logo.svg" alt="netflix logo" className="h-12"/>
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md rounded-md w-full">
                        <h2 className="text-white text-4xl mb-8 font-semibold">
                            {variant === 'login' ? 'Sign in' : 'Create an account'}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {variant === 'register' && (
                                <Input
                                    label="Username"
                                    onChange={(ev: any) => setName(ev.target.value)}
                                    id="name"
                                    value={name}
                                />
                            )}
                            <Input
                                label="Email"
                                onChange={(ev: any) => setEmail(ev.target.value)}
                                id="email"
                                type="email"
                                value={email}
                            />
                            <div className="relative">
                                <Input
                                    label="Password"
                                    onChange={(ev: any) => setPassword(ev.target.value)}
                                    id="password"
                                    type={showPassword ? "text" : "password"} // Перемикаємо тип
                                    value={password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                >
                                    {showPassword ? 'Hide' : 'Show'}
                                </button>
                            </div>
                        </div>
                        <div className="min-h-6 mt-4">
                            {error && (
                                <p
                                    className={`text-red-500 text-sm text-center transition-opacity duration-500 ${
                                        showError ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    {error}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleAuth}
                            className="bg-red-600 py-3 text-white rounded-md w-full mt-6 hover:bg-red-700 transition"
                        >
                            {variant === 'login' ? 'Login' : 'Sign up'}
                        </button>
                        <p className="text-neutral-500 mt-12">
                            {variant === 'login' ? 'First time using Netflix?' : 'Already have an account?'}
                            <span onClick={toggleVariant} className="text-white ml-1 hover:underline cursor-pointer">
                                {variant === 'login' ? 'Create an account' : 'Login'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
