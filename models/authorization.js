function can(user, feature) {
  let authorized = false;

  const userTrying = user.features;

  if (userTrying.includes(feature)) {
    authorized = true;
    return authorized;
  }
  return authorized;
}

const authorization = {
  can,
};

export default authorization;
