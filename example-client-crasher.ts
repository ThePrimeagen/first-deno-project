while (true) {
    const res = await fetch("http://localhost:8080");
    await res.text();
}


