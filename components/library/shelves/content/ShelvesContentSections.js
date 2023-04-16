import ShelvesContentSection from "@/components/library/shelves/content/ShelvesContentSection";

export default function ShelvesContentSections({ content }) {
    let e = [];
    let num = 0;
    for (let key in content) {
        let val = content[key];
        e = [...e, <ShelvesContentSection key={key} uid={num} shelf={key} books={val}/>];
        num++;
    }
    return e;
}
