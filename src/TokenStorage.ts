abstract class TokenStorage {
  public abstract generateToken(): Promise<string>
  public abstract verifyToken(id: string): Promise<void>
  public abstract markTokenUsed(id: string): Promise<void>
}

export {
  TokenStorage
}
