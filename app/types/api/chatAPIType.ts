

export interface useAIStreamReturnInterface{
    controller:AbortController,
    context:Ref<string>,
    loading:Ref<boolean>,
    fetchStream:()=>Promise<unknown>
}