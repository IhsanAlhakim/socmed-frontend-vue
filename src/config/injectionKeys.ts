import type { UserData } from "@/types/user";
import type { InjectionKey } from "vue";

export const loggedInUserKey = Symbol() as InjectionKey<UserData>