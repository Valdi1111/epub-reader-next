import ShelvesContentSections from "@/components/library/shelves/content/ShelvesContentSections";

export default function ShelvesContent({ content }) {
    return (
        <div className="d-md-block scroll-pane col-12 col-md-8 col-lg-9">
            <div className="scroll-pane-inner accordion accordion-flush">
                <ShelvesContentSections content={content}/>
            </div>
        </div>
    );
}
