function status(request, response) {
  response.status(200).json({ key: "Hello, Filipe" });
}

export default status;
