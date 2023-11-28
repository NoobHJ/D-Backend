it("waits for done to be called", (done) => {
  setTimeout(() => {
    expect(true).toBe(true);
    done();
  }, 1000);
});
