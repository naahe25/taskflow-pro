import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-slate-950 text-white">
            <Sidebar />
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default Layout;