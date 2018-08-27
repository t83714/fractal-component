import AppContainer from "../src/AppContainer";

test("Should create appContainer with no error", ()=>{
    const appContainer = new AppContainer();
    expect(appContainer).toEqual(expect.any(AppContainer));
});