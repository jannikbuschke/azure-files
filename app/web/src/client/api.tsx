import * as React from "react"
import { QueryOptions, UseQueryOptions } from "react-query"
import { useApi, ApiResult, useNotify } from "glow-core"
import { useAction, useSubmit, UseSubmit, ProblemDetails } from "glow-core"
import { Formik, FormikConfig, FormikFormProps, FormikProps } from "formik"
import { Form } from "formik-antd"
import * as System from "./System"
import * as Glow_Core_MartenAndPgsql from "./Glow_Core_MartenAndPgsql"
import * as AzFiles from "./AzFiles"
import * as AzFiles_Features from "./AzFiles_Features"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as AzFiles_Features_GoogleDrive from "./AzFiles_Features_GoogleDrive"
import * as AzFiles_Features_Fsi from "./AzFiles_Features_Fsi"
import * as AzFiles_GenerateObsidianNotes from "./AzFiles_GenerateObsidianNotes"
import * as AzFiles_Features_Gallery from "./AzFiles_Features_Gallery"
import * as AzFiles_Galleries from "./AzFiles_Galleries"
import * as NodaTime from "./NodaTime"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as System_Text_Json_Serialization from "./System_Text_Json_Serialization"
import * as Glow_TestAutomation from "./Glow_TestAutomation"
import * as Glow_Azure_AzureKeyVault from "./Glow_Azure_AzureKeyVault"
import * as Glow_Core_Profiles from "./Glow_Core_Profiles"
import * as MediatR from "./MediatR"
import * as Glow_Debug from "./Glow_Debug"
import * as System_Collections_Generic from "./System_Collections_Generic"
import * as Azure_Storage_Blobs_Models from "./Azure_Storage_Blobs_Models"
import * as Azure from "./Azure"

export type QueryInputs = {
  "/api/debug/get-documents": Glow_Core_MartenAndPgsql.GetDocuments,
  "/api/blob/get-file": AzFiles.GetBlobFile,
  "/api/files/get-indexed-files": AzFiles.GetIndexedFiles,
  "/api/files/get-indexed-file": AzFiles.GetIndexedFile,
  "/api/blob/get-files": AzFiles.GetFiles,
  "/api/file/get-next-untagged": AzFiles.GetNextUntaggedBlob,
  "/api/file/get-all-untagged": AzFiles.GetAllUntagged,
  "/api/blob/get-containers": AzFiles.GetBlobContainers,
  "/api/g-drive/show-files": AzFiles_Features_GoogleDrive.GetGoogleDriveFiles,
  "/api/get-images-on-date": AzFiles_Features_Gallery.GetImagesOnDate,
  "/api/features/gallery/get-galleries": AzFiles_Features_Gallery.GetGalleries,
  "/api/features/gallery/get-gallery": AzFiles_Features_Gallery.GetGallery,
  "/api/features/gallery/get-gallery-items": AzFiles_Features_Gallery.GetGalleryItems,
  "/api/blob/get-blob-metadata": AzFiles_Features.GetBlobMetadata,
  "/api/blob/get-exif-data-from-blob-file": AzFiles_Features.GetExifDataFromBlobFile,
  "/api/get-navbar": AzFiles_Features.GetNavbar,
  "/api/get-tags": AzFiles_Features.GetTags,
  "/api/get-images": AzFiles_Features.GetImages,
  "/api/get-inbox-files": AzFiles_Features.GetInboxFiles,
  "/api/get-inbox-file": AzFiles_Features.GetInboxFile,
  "/api/auto-inbox/get-items": AzFiles.GetLobbyItems,
  "/api/glow/test-automation/get-available-fake-users": Glow_TestAutomation.GetAvailableFakeUsers,
  "/glow/profile/get-profile": Glow_Core_Profiles.GetProfile,
  "/api/gebug/get-document-names": Glow_Core_MartenAndPgsql.GetKnownDocumentNames,
  "/api/es/get-events": Glow_Core_MartenAndPgsql.GetEsEvents,
  "/api/es/get-events-without-validation": Glow_Core_MartenAndPgsql.GetEsEventsWithoutValidation,
  "/api/pgsql/get-activity": Glow_Core_MartenAndPgsql.GetPgsqlActivities,
  "/api/events/get-last-modified": Glow_Core_MartenAndPgsql.GetLastModified,
  "/api/glow/pgsql/get-activity": Glow_Debug.GetPgsqlActivities,
}
export type QueryOutputs = {
  "/api/debug/get-documents": System_Collections_Generic.IEnumerable<System.Object>,
  "/api/blob/get-file": AzFiles.AzureFilesBlobProperties,
  "/api/files/get-indexed-files": System_Collections_Generic.List<AzFiles.FileProjection>,
  "/api/files/get-indexed-file": AzFiles.FileProjection,
  "/api/blob/get-files": System_Collections_Generic.List<Azure_Storage_Blobs_Models.BlobItem>,
  "/api/file/get-next-untagged": AzFiles.FileProjection,
  "/api/file/get-all-untagged": System_Collections_Generic.List<AzFiles.FileProjection>,
  "/api/blob/get-containers": System_Collections_Generic.List<Azure_Storage_Blobs_Models.BlobContainerItem>,
  "/api/g-drive/show-files": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Collections.FSharpList<AzFiles_Features_GoogleDrive.GDriveFile>,AzFiles.ApiError>,
  "/api/get-images-on-date": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Collections.FSharpList<AzFiles_Features_Gallery.PositionedImage0>,AzFiles.ApiError>,
  "/api/features/gallery/get-galleries": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Collections.FSharpList<AzFiles_Features_Gallery.Gallery>,AzFiles.ApiError>,
  "/api/features/gallery/get-gallery": Microsoft_FSharp_Core.FSharpResult<AzFiles_Features_Gallery.Gallery,AzFiles.ApiError>,
  "/api/features/gallery/get-gallery-items": Microsoft_FSharp_Core.FSharpResult<AzFiles_Features_Gallery.PaginatedResult<AzFiles_Galleries.Image>,AzFiles.ApiError>,
  "/api/blob/get-blob-metadata": System_Collections_Generic.IDictionary<System.String,System.String>,
  "/api/blob/get-exif-data-from-blob-file": Microsoft_FSharp_Core.FSharpOption<Microsoft_FSharp_Collections.FSharpList<AzFiles.ExifValue>>,
  "/api/get-navbar": AzFiles_Features.Navbar,
  "/api/get-tags": Microsoft_FSharp_Collections.FSharpList<System.String>,
  "/api/get-images": Microsoft_FSharp_Collections.FSharpList<AzFiles.FileViewmodel>,
  "/api/get-inbox-files": AzFiles_Features.Page<AzFiles.FileViewmodel>,
  "/api/get-inbox-file": Microsoft_FSharp_Core.FSharpResult<AzFiles_Features.InboxFileResult,AzFiles.ApiError>,
  "/api/auto-inbox/get-items": Microsoft_FSharp_Collections.FSharpList<AzFiles.LobbyItem>,
  "/api/glow/test-automation/get-available-fake-users": Glow_TestAutomation.FakeUsers,
  "/glow/profile/get-profile": Glow_Core_Profiles.Profile,
  "/api/gebug/get-document-names": Microsoft_FSharp_Collections.FSharpList<System.String>,
  "/api/es/get-events": Microsoft_FSharp_Collections.FSharpList<Glow_Core_MartenAndPgsql.EventViewmodel>,
  "/api/es/get-events-without-validation": System_Collections_Generic.List<Glow_Core_MartenAndPgsql.RawEventModel>,
  "/api/pgsql/get-activity": System_Collections_Generic.List<Glow_Core_MartenAndPgsql.Activity>,
  "/api/events/get-last-modified": Glow_Core_MartenAndPgsql.StreamInfo,
  "/api/glow/pgsql/get-activity": System_Collections_Generic.List<Glow_Debug.Activity>,
}
export type Outputs = {
  "/api/blob/delete-all-in-container": MediatR.Unit,
  "/api/blob/delete-file": MediatR.Unit,
  "/api/upload-form-files": Microsoft_FSharp_Collections.FSharpList<Microsoft_FSharp_Core.FSharpResult<AzFiles.FileSavedToStorage,System.String>>,
  "/api/test-action": Microsoft_FSharp_Collections.FSharpList<Microsoft_FSharp_Core.FSharpResult<AzFiles.FileSavedToStorage,AzFiles.ErrorResult>>,
  "/api/remove-tagged-images-from-inbox": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/add-property": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/remove-property": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/UpdateProperty": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/upsert-properties": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/upsert-properties-raw": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/rotate": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/g-drive/download-file-to-inbox": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/fsi/evaluate": Microsoft_FSharp_Core.FSharpResult<AzFiles_Features_Fsi.EvalResult,AzFiles.ApiError>,
  "/api/my/write-obsidian-notes": Microsoft_FSharp_Core.FSharpResult<MediatR.Unit,AzFiles.ApiError>,
  "/api/features/gallery/remove-item": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/features/gallery/create-gallery": Microsoft_FSharp_Core.FSharpResult<AzFiles_Galleries.GalleryId,AzFiles.ApiError>,
  "/api/features/gallery/add-images-on-base": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/features/gallery/update-gallery": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/features/gallery/delete-gallery": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/my/create-static-gallery": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/my/write-blog-data": MediatR.Unit,
  "/api/file/delete-file": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/file/tag-many": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/file/set-tags": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzFiles.ApiError>,
  "/api/glow/set-openid-connect-options": MediatR.Unit,
  "/api/debug/archive-events": Microsoft_FSharp_Core.FSharpResult<System.Int32,Glow_Core_MartenAndPgsql.ApiError>,
  "/api/debug/restore-events": Microsoft_FSharp_Core.FSharpResult<System.Int32,Glow_Core_MartenAndPgsql.ApiError>,
  "/api/debug/archive-event": Microsoft_FSharp_Core.FSharpResult<System.Int32,Glow_Core_MartenAndPgsql.ApiError>,
  "/api/debug/restore-event": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,Glow_Core_MartenAndPgsql.ApiError>,
  "/api/debug/rename-event-dotnet-type": Microsoft_FSharp_Core.FSharpResult<System.Int32,Glow_Core_MartenAndPgsql.ApiError>,
  "/api/application/remove-all-event-data": MediatR.Unit,
  "/api/debug/rebuild-projection": MediatR.Unit,
  "/api/debug/rebuild-all-projections": MediatR.Unit,
}
export type Actions = {
  "/api/blob/delete-all-in-container": AzFiles.DeleteAllBlobs,
  "/api/blob/delete-file": AzFiles.DeleteBlobFile,
  "/api/upload-form-files": AzFiles.UploadFormFiles,
  "/api/test-action": AzFiles.TestAction,
  "/api/remove-tagged-images-from-inbox": AzFiles_Features.RemoveTaggedImagesFromInbox,
  "/api/add-property": AzFiles_Features.AddProperty,
  "/api/remove-property": AzFiles_Features.RemoveProperty,
  "/UpdateProperty": AzFiles_Features.UpdateProperty,
  "/api/upsert-properties": AzFiles_Features.UpsertProperties,
  "/api/upsert-properties-raw": AzFiles_Features.UpsertPropertiesRaw,
  "/api/rotate": AzFiles_Features.Rotate,
  "/api/g-drive/download-file-to-inbox": AzFiles_Features_GoogleDrive.DownloadFileToInbox,
  "/api/fsi/evaluate": AzFiles_Features_Fsi.EvaluateFs,
  "/api/my/write-obsidian-notes": AzFiles_GenerateObsidianNotes.GenerateObsidianNotes,
  "/api/features/gallery/remove-item": AzFiles_Features_Gallery.RemoveItemFromGallery,
  "/api/features/gallery/create-gallery": AzFiles_Features_Gallery.CreateGallery,
  "/api/features/gallery/add-images-on-base": AzFiles_Features_Gallery.AddImagesOnBasedOn,
  "/api/features/gallery/update-gallery": AzFiles_Features_Gallery.UpdateGallery,
  "/api/features/gallery/delete-gallery": AzFiles_Features_Gallery.DeleteGallery,
  "/api/my/create-static-gallery": AzFiles.GenerateStaticGallery,
  "/api/my/write-blog-data": AzFiles.GenerateBlogData,
  "/api/file/delete-file": AzFiles_Features.DeleteFile,
  "/api/file/tag-many": AzFiles_Features.TagMany,
  "/api/file/set-tags": AzFiles_Features.SetTags,
  "/api/glow/set-openid-connect-options": Glow_Azure_AzureKeyVault.SetOpenIdConnectOptions,
  "/api/debug/archive-events": Glow_Core_MartenAndPgsql.ArchiveEvents,
  "/api/debug/restore-events": Glow_Core_MartenAndPgsql.RestoreEvents,
  "/api/debug/archive-event": Glow_Core_MartenAndPgsql.ArchiveEvent,
  "/api/debug/restore-event": Glow_Core_MartenAndPgsql.RestoreEvent,
  "/api/debug/rename-event-dotnet-type": Glow_Core_MartenAndPgsql.RenameEventDotnetTypeName,
  "/api/application/remove-all-event-data": Glow_Core_MartenAndPgsql.RemoveAllData,
  "/api/debug/rebuild-projection": Glow_Core_MartenAndPgsql.RebuildProjections,
  "/api/debug/rebuild-all-projections": Glow_Core_MartenAndPgsql.RebuildAllProjections,
}

type TagWithKey<TagName extends string, T> = {
  [K in keyof T]: { [_ in TagName]: K } & T[K]
};

export type ActionTable = TagWithKey<"url", Actions>

export type TypedActionHookResult<
  ActionName extends keyof ActionTable
> = UseSubmit<Actions[ActionName], Outputs[ActionName]>

export type TypedActionHook = <ActionName extends keyof ActionTable>(
  key: ActionName,
) => TypedActionHookResult<ActionName>

export const useTypedAction: TypedActionHook = <
  ActionName extends keyof ActionTable
>(
  key: ActionName,
) => {
  const s = useAction<Actions[ActionName], Outputs[ActionName]>(key)
  return s
}

export type QueryTable = TagWithKey<"url", QueryInputs>;

export function useTypedQuery<ActionName extends keyof QueryTable>(key: ActionName, {
    placeholder,
    input,
    queryOptions
  }: {
    placeholder: QueryOutputs[ActionName],
    input:  QueryInputs[ActionName]
    queryOptions?: UseQueryOptions<QueryOutputs[ActionName]>
  }): ApiResult<QueryOutputs[ActionName]> {

  const { data, ...rest} = useApi({
    url: key,
    method:"POST",
    payload: input,
    // todo: find defaultPlaceholder
    placeholder: placeholder,
    queryOptions: queryOptions
  })

  const result = data as QueryOutputs[ActionName]

  return { data: result, ...rest} as any
}

export type FieldPath<P, S> = {
  _PATH_: string & { _BRAND_: P & S }
}

export type PathProxy<P, S> = FieldPath<P, S> &
  { [K in keyof S]: PathProxy<P, S[K]> }

const IdPath = { _PATH_: "" } as FieldPath<any, any>

export function pathProxy<S, P = S>(
  parent: FieldPath<P, S> = IdPath as any,
): PathProxy<P, S> {
  return new Proxy(parent as any, {
    get(target: any, key: any) {
      if (key in target) return target[key]
      return pathProxy<any, any>({
        _PATH_: `${parent._PATH_ && parent._PATH_ + "."}${key}`,
        } as any)
    },
})
}

export function TypedForm<ActionName extends keyof ActionTable>({
  initialValues,
  actionName,
  formProps,
  children,
  onSuccess,
  beforeSubmit,
  onSubmit,
  onError,
}: Omit<FormikConfig<Actions[ActionName]>, "onSubmit"|"children"> & {
  children: ((props: FormikProps<Actions[ActionName]>, pathProxy: PathProxy<Actions[ActionName], Actions[ActionName]>) => React.ReactNode) | React.ReactNode
  actionName: ActionName
  beforeSubmit?: (values: Actions[ActionName]) => Actions[ActionName]
  onSubmit?: (values: Actions[ActionName]) => void
  formProps?: FormikFormProps
  onSuccess?: (payload: Outputs[ActionName]) => void
  onError?: (error: ProblemDetails) => void
}) {
  const _ = React.useMemo(()=> pathProxy<Actions[ActionName]>(),[])
  const { messageSuccess, notifyError} = useNotify()
  const [submit, validate] = useTypedAction<ActionName>(actionName)
  return (
    <Formik
      validate={(values) => validate(beforeSubmit ? beforeSubmit(values) : values) }
      validateOnBlur={true}
      enableReinitialize={true}
      validateOnChange={false}
      initialValues={initialValues}
      onSubmit={async (values) => {
        onSubmit && onSubmit(values)
        const response = await submit(beforeSubmit ? beforeSubmit(values) : values)
        if (response.ok) {
          onSuccess && onSuccess(response.payload)
        } else {
          onError && onError(response.error)
          !onError && notifyError(response.error)
        }
      }
    }
    >
      {(f) => (
       <form {...formProps}>
        {typeof children === "function" ? children(f,_) : children}
        </form>

      )}
    </Formik>)
}

