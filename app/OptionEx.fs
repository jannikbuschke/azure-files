namespace Utils

module Option =
  /// Returns Option.None is string IsNullOrEmpty, otherwise Option.Some value
  let ofString (value: string) =
    if System.String.IsNullOrEmpty value then
      None
    else
      Some value
