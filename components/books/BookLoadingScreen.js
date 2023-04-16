import LoadingComponent from "@/components/LoadingComponent";

export default function BookLoadingScreen({ ready }) {
    if (ready) {
        return <></>;
    }

    return (
        <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
            <LoadingComponent/>
        </div>
    );
}
